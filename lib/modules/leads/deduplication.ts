import { supabase } from '@/lib/supabase'

export interface DeduplicationResult {
  isDuplicate: boolean
  matchedOn: string | null
  existingLeadId: string | null
}

export async function checkDuplicate(leadData: {
  business_name?: string
  email?: string
  phone?: string
  website?: string
}): Promise<DeduplicationResult> {

  // Priority 1: Email (most reliable)
  if (leadData.email) {
    const normalized = leadData.email.toLowerCase().trim()
    const { data } = await supabase
      .from('leads')
      .select('id')
      .eq('email', normalized)
      .single()

    if (data) {
      return {
        isDuplicate: true,
        matchedOn: 'email',
        existingLeadId: data.id,
      }
    }
  }

  // Priority 2: Phone (normalized)
  if (leadData.phone) {
    const normalized = normalizePhone(leadData.phone)

    if (normalized) {
      const { data } = await supabase
        .from('leads')
        .select('id, phone')

      for (const lead of data || []) {
        if (lead.phone && normalizePhone(lead.phone) === normalized) {
          return {
            isDuplicate: true,
            matchedOn: 'phone',
            existingLeadId: lead.id,
          }
        }
      }
    }
  }

  // Priority 3: Website domain
  if (leadData.website) {
    const domain = extractDomain(leadData.website)

    if (domain) {
      const { data } = await supabase
        .from('leads')
        .select('id, website')

      for (const lead of data || []) {
        if (lead.website && extractDomain(lead.website) === domain) {
          return {
            isDuplicate: true,
            matchedOn: 'website',
            existingLeadId: lead.id,
          }
        }
      }
    }
  }

  // Priority 4: Business name (fuzzy)
  if (leadData.business_name) {
    const normalized = normalizeName(leadData.business_name)

    const { data } = await supabase
      .from('leads')
      .select('id, business_name')

    for (const lead of data || []) {
      const existing = normalizeName(lead.business_name)

      if (isSimilar(normalized, existing)) {
        return {
          isDuplicate: true,
          matchedOn: 'business_name',
          existingLeadId: lead.id,
        }
      }
    }
  }

  return {
    isDuplicate: false,
    matchedOn: null,
    existingLeadId: null,
  }
}

function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')

  // Australian format
  if (digits.startsWith('61')) return '+' + digits
  if (digits.startsWith('04') && digits.length === 10) return '+61' + digits.substring(1)
  if (digits.startsWith('4') && digits.length === 9) return '+61' + digits

  return digits.length >= 8 ? digits : null
}

function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url)
    return urlObj.hostname.replace('www.', '').toLowerCase()
  } catch {
    return null
  }
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/pty|ltd|limited|inc|llc|co/g, '')
    .trim()
}

function isSimilar(str1: string, str2: string): boolean {
  if (str1 === str2) return true
  if (str1.includes(str2) || str2.includes(str1)) return true
  if (Math.abs(str1.length - str2.length) > 5) return false

  let matches = 0
  const minLength = Math.min(str1.length, str2.length)

  for (let i = 0; i < minLength; i++) {
    if (str1[i] === str2[i]) matches++
  }

  return (matches / minLength) > 0.8
}

export async function logDuplicate(
  source: string,
  matchedOn: string,
  existingLeadId: string,
  attemptedData: any
) {
  await supabase.from('duplicate_logs').insert({
    source,
    matched_on: matchedOn,
    existing_lead_id: existingLeadId,
    attempted_data: attemptedData,
    logged_at: new Date().toISOString(),
  })
}
