import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const issues: any[] = []
  const warnings: any[] = []

  try {
    // 1. Check if critical component files exist
    const criticalFiles = [
      'components/admin/sidebar.tsx',
      'components/admin/top-nav.tsx',
      'components/admin/admin-layout.tsx',
      'lib/stores/layout-store.ts',
      'app/admin/dashboard/page.tsx',
      'app/admin/leads/page.tsx',
      'app/admin/analytics/page.tsx',
    ]

    for (const file of criticalFiles) {
      const filePath = path.join(process.cwd(), file)
      if (!fs.existsSync(filePath)) {
        issues.push({
          severity: 'critical',
          type: 'missing_file',
          file,
          issue: 'Critical component file missing',
        })
      }
    }

    // 2. Check globals.css
    const globalsPath = path.join(process.cwd(), 'app/globals.css')
    if (fs.existsSync(globalsPath)) {
      const content = fs.readFileSync(globalsPath, 'utf-8')

      // Check for dark mode styles
      if (content.includes('.dark') || content.includes('dark:')) {
        warnings.push({
          severity: 'warning',
          type: 'styling',
          file: 'app/globals.css',
          issue: 'Dark mode styles detected (may cause mixed light/dark UI)',
        })
      }
    }

    // 3. Check package.json for required dependencies
    const packagePath = path.join(process.cwd(), 'package.json')
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
      const requiredDeps = [
        'zustand',
        'framer-motion',
        '@tanstack/react-table',
        'apexcharts',
        'react-apexcharts',
        '@hello-pangea/dnd',
      ]

      for (const dep of requiredDeps) {
        if (!packageJson.dependencies?.[dep]) {
          issues.push({
            severity: 'error',
            type: 'missing_dependency',
            package: dep,
            issue: `Required package "${dep}" not installed`,
          })
        }
      }
    }

    return NextResponse.json({
      status: 'complete',
      summary: {
        totalIssues: issues.length,
        totalWarnings: warnings.length,
      },
      issues,
      warnings,
      timestamp: new Date().toISOString(),
    })

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
    }, { status: 500 })
  }
}
