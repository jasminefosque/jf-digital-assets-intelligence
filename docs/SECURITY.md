# Security Documentation

This document outlines security practices and guidelines for implementing secure data integrations in dashboard systems.

## Example Dashboard Security

This example dashboard demonstrates secure development practices:

✅ **No API keys or credentials required**
✅ **No external API connections**
✅ **No production endpoints or URLs**
✅ **No database connections**
✅ **Uses synthetic data only**

This approach enables immediate demonstration without any security concerns from credential management.

## Environment Variables for Production Systems

When implementing real data integrations, use environment variables for configuration.

### Development
Create a `.env.local` file (gitignored) for local development:

```bash
# .env.local - Never commit this file
VITE_API_BASE_URL=https://api.example.com
VITE_API_KEY=your_development_key_here
```

Never commit `.env.local` to Git.

### Production
Use your hosting platform's secret management:

**Vercel**
```bash
vercel env add VITE_DATA_MODE
```

**Netlify**
```
Site Settings → Environment Variables
```

**AWS**
```bash
aws secretsmanager create-secret --name app/config
```

## Best Practices

### 1. Never Hardcode Secrets
❌ **Bad**
```typescript
const apiKey = "sk_live_abc123";
const dbUrl = "postgresql://user:pass@host/db";
```

✅ **Good**
```typescript
const apiKey = import.meta.env.VITE_API_KEY;
const dbUrl = import.meta.env.VITE_DATABASE_URL;
```

### 2. Use Environment-Specific Configs
```typescript
const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
```

### 3. Validate Environment Variables
```typescript
const requiredEnvVars = ['VITE_API_URL'];
requiredEnvVars.forEach(key => {
  if (!import.meta.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
```

### 4. Prefix Public Variables
Only variables prefixed with `VITE_` are exposed to the client:

```bash
VITE_PUBLIC_API=https://api.example.com  # ✅ Available in client
DATABASE_URL=postgres://...              # ❌ Server-side only
```

## Synthetic Data Approach

This example dashboard uses synthetic data generation, which:
- Requires **no secrets or external services**
- Makes **no network calls**
- Requires **no authentication**
- Is **completely offline-capable**

This approach enables:
- Immediate demonstration without setup
- No security risk from credential exposure
- No dependencies on external services
- Easy testing and development

## Implementing Data Integrations Securely

When adding real data sources to a production system, follow these security guidelines:

### Guidelines for API Integration
1. **Never hardcode credentials**
   - Use environment variables for all API keys and secrets
   - Store sensitive credentials in secrets management systems
   
2. **Implement proper authentication**
   - Use OAuth 2.0 or API keys as appropriate
   - Rotate credentials regularly
   - Use different credentials for development and production

3. **Document rate limits**
   - Implement client-side throttling
   - Cache responses appropriately
   - Monitor API usage

4. **Handle errors gracefully**
   - Never expose error details that leak infrastructure information
   - Provide user-friendly error messages
   - Log errors securely for debugging

### Example Secure Data Provider Implementation
```typescript
export class SecureDataProvider implements DataProvider {
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    // Load from environment variables
    this.apiKey = import.meta.env.VITE_API_KEY;
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    
    if (!this.apiKey || !this.baseUrl) {
      throw new Error('Missing required API configuration');
    }
  }
  
  async getSeries(metricId: string): Promise<TimeSeries> {
    try {
      const response = await fetch(`${this.baseUrl}/data/${metricId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformToSchema(data);
    } catch (error) {
      console.error('Failed to fetch data:', error.message);
      // Fallback to cached data or error state
      throw new Error('Unable to fetch data at this time');
    }
  }
  
  private transformToSchema(data: any): TimeSeries {
    // Transform external format to internal schema
    // Validate with Zod schemas
  }
}
```

## Git Security

### .gitignore Essentials
```gitignore
# Environment variables
.env.local
.env.*.local

# Secrets
*.pem
*.key
secrets/

# Build artifacts
dist/
node_modules/
```

### Pre-commit Hooks (Recommended)
Install `git-secrets` or similar:
```bash
npm install -D @commitlint/cli
```

Scan for accidentally committed secrets:
```bash
npx secretlint '**/*'
```

### If Secrets Are Accidentally Committed
1. **Immediately rotate** the exposed secrets
2. **Do not just delete the file**—Git history retains it
3. Use `git filter-branch` or BFG Repo-Cleaner to remove from history
4. Force push (only if repository is private and you control it)
5. Notify security team

## Production Security Checklist

When deploying to production:

### Infrastructure
- [ ] Use HTTPS only (enforce with HSTS headers)
- [ ] Implement Content Security Policy (CSP)
- [ ] Enable CORS with specific allowed origins
- [ ] Use WAF (Web Application Firewall)
- [ ] Enable DDoS protection

### Authentication
- [ ] Implement proper user authentication
- [ ] Use secure session management
- [ ] Implement role-based access control (RBAC)
- [ ] Enable MFA for admin access
- [ ] Use OAuth 2.0 / OpenID Connect for third-party auth

### API Security Best Practices
- [ ] Rate limit all API endpoints
- [ ] Validate all inputs
- [ ] Sanitize outputs (prevent XSS)
- [ ] Use parameterized queries (prevent SQL injection)
- [ ] Implement request signing
- [ ] Use API keys with proper rotation policies
- [ ] Track API usage patterns
- [ ] Implement retry logic with exponential backoff
- [ ] Monitor for unusual access patterns

### Data Security
- [ ] Encrypt data at rest
- [ ] Encrypt data in transit (TLS 1.3+)
- [ ] Implement proper access controls
- [ ] Regular security audits
- [ ] Backup encryption keys securely
- [ ] GDPR/CCPA compliance if handling user data

### Monitoring
- [ ] Log all authentication attempts
- [ ] Monitor for suspicious activity
- [ ] Set up alerts for failed logins
- [ ] Track API usage patterns
- [ ] Regular security scanning (Snyk, Dependabot)

## Dependency Security

### Automated Scanning
```bash
npm audit
npm audit fix
```

### Dependabot
Enable in GitHub repository settings:
```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
```

### Manual Review
Before adding new dependencies:
1. Check npm package health
2. Review maintainer activity
3. Scan for known vulnerabilities
4. Review license compatibility
5. Assess package size and dependencies

## Compliance

### Portfolio Context
This project is a demonstration only and does not:
- Handle real user data
- Process financial transactions
- Store personally identifiable information (PII)
- Require regulatory compliance

### Production Requirements
If deploying with real data:
- Consult legal counsel for applicable regulations
- Implement GDPR data handling (if EU users)
- Follow SEC guidance (if financial advice)
- Comply with local data protection laws
- Implement audit logging
- Create privacy policy and terms of service

## Incident Response

If a security issue is discovered:

1. **Assess severity** (low/medium/high/critical)
2. **Contain** the issue immediately
3. **Rotate compromised credentials**
4. **Patch** the vulnerability
5. **Document** the incident
6. **Notify** affected parties if required
7. **Post-mortem** to prevent recurrence

## Reporting Security Issues

To report a security vulnerability:
- **Do not** open a public GitHub issue
- Email: [security contact - update with your email]
- Include detailed description and reproduction steps
- Allow reasonable time for fix before disclosure

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [Vite Security](https://vitejs.dev/guide/env-and-mode.html#env-files)
- [React Security](https://react.dev/learn/escape-hatches#security)

## Conclusion

This dashboard prioritizes security through:
- **Separation**: Clear boundary between demo and production
- **Transparency**: No hidden secrets or backdoors  
- **Best Practices**: Industry-standard security patterns
- **Auditability**: Open source and reviewable

Remember: **This is a portfolio project.** Production systems require significantly more security infrastructure than demonstrated here.
