-- Seed data for email templates
-- Run this SQL in your Supabase SQL editor to create default email templates

-- Template 1: Cold Outreach
INSERT INTO email_templates (id, name, subject, html_body, text_body, is_active, created_at)
VALUES (
  gen_random_uuid(),
  'Cold Outreach - Website Demo',
  'Quick question about {{business_name}}',
  '<html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Hi there,</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">I noticed that {{business_name}} could benefit from a professional website.</p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;"><strong>So I built you one for free.</strong></p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">Here''s your live demo:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="{{preview_url}}"
           style="background: #2563eb; color: white; padding: 15px 30px;
                  text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">
          View Your Demo Website
        </a>
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">If you like it, you can make it live for just $99/month (cancel anytime).</p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">No commitment to check it out.</p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">Best regards,<br>Your Name</p>
    </body>
  </html>',
  'Hi there,

I noticed that {{business_name}} could benefit from a professional website.

So I built you one for free.

Here''s your live demo: {{preview_url}}

If you like it, you can make it live for just $99/month (cancel anytime).

No commitment to check it out.

Best regards,
Your Name',
  true,
  NOW()
);

-- Template 2: Follow-up Day 3
INSERT INTO email_templates (id, name, subject, html_body, text_body, is_active, created_at)
VALUES (
  gen_random_uuid(),
  'Follow-up Day 3 - No Open',
  'Did you see this? ({{business_name}})',
  '<html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Hi again,</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">I wanted to make sure you saw the website I built for {{business_name}}.</p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">Here''s the link again:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="{{preview_url}}"
           style="background: #2563eb; color: white; padding: 15px 30px;
                  text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">
          View Your Website Demo
        </a>
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">Takes 30 seconds to check out. Let me know what you think!</p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">Best regards,<br>Your Name</p>
    </body>
  </html>',
  'Hi again,

I wanted to make sure you saw the website I built for {{business_name}}.

Here''s the link: {{preview_url}}

Takes 30 seconds to check out.

Best regards,
Your Name',
  true,
  NOW()
);

-- Template 3: Follow-up Day 7
INSERT INTO email_templates (id, name, subject, html_body, text_body, is_active, created_at)
VALUES (
  gen_random_uuid(),
  'Follow-up Day 7 - Opened but No Click',
  'Quick follow-up about your website',
  '<html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Hi,</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">I noticed you opened my email about the website for {{business_name}}.</p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">Did you get a chance to look at it?</p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">Here''s the demo link: <a href="{{preview_url}}" style="color: #2563eb; text-decoration: underline;">View Demo</a></p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">If you have any questions or want changes made, just reply to this email.</p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">Happy to customize it for you (no charge).</p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">Best regards,<br>Your Name</p>
    </body>
  </html>',
  'Hi,

I noticed you opened my email about the website for {{business_name}}.

Did you get a chance to look at it?

Here''s the demo: {{preview_url}}

Happy to customize it for you (no charge).

Best regards,
Your Name',
  true,
  NOW()
);

-- Template 4: Follow-up Day 14
INSERT INTO email_templates (id, name, subject, html_body, text_body, is_active, created_at)
VALUES (
  gen_random_uuid(),
  'Follow-up Day 14 - Final',
  'Last call: Free website for {{business_name}}',
  '<html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Hi,</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">This is my last email about the website I built for {{business_name}}.</p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">If you''re not interested, no worries - I''ll stop bothering you!</p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">But if you want to see it one more time: <a href="{{preview_url}}" style="color: #2563eb; text-decoration: underline;">View Demo</a></p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">Offer stands: $99/month for a professional website, cancel anytime.</p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">Just reply if interested.</p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">Best regards,<br>Your Name</p>
    </body>
  </html>',
  'Hi,

This is my last email about the website I built for {{business_name}}.

If interested: {{preview_url}}

$99/month, cancel anytime.

Best regards,
Your Name',
  true,
  NOW()
);
