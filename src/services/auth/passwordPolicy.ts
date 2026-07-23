export const PASSWORD_MIN_LENGTH = 12

const LOWERCASE_PATTERN = /[a-z]/
const UPPERCASE_PATTERN = /[A-Z]/
const DIGIT_PATTERN = /\d/
const SYMBOL_PATTERN = /[!@#$%^&*()_+\-=\[\]{};'\\:"|<>?,./`~]/

export type PasswordRuleKey = 'length' | 'lowercase' | 'uppercase' | 'digit' | 'symbol'

export interface PasswordRuleResult {
  readonly key: PasswordRuleKey
  readonly label: string
  readonly passed: boolean
}

export interface PasswordPolicyResult {
  readonly valid: boolean
  readonly rules: readonly PasswordRuleResult[]
  readonly issues: readonly string[]
}

export const PASSWORD_POLICY_SUMMARY = `Usá al menos ${PASSWORD_MIN_LENGTH} caracteres, con minúscula, mayúscula, número y símbolo.`

export function assessPassword(password: string): PasswordPolicyResult {
  const rules: PasswordRuleResult[] = [
    { key: 'length', label: `${PASSWORD_MIN_LENGTH}+ caracteres`, passed: password.length >= PASSWORD_MIN_LENGTH },
    { key: 'lowercase', label: 'Una minúscula', passed: LOWERCASE_PATTERN.test(password) },
    { key: 'uppercase', label: 'Una mayúscula', passed: UPPERCASE_PATTERN.test(password) },
    { key: 'digit', label: 'Un número', passed: DIGIT_PATTERN.test(password) },
    { key: 'symbol', label: 'Un símbolo', passed: SYMBOL_PATTERN.test(password) },
  ]
  const issues = rules.filter((rule) => !rule.passed).map((rule) => rule.label)

  return Object.freeze({
    valid: issues.length === 0,
    rules: Object.freeze(rules),
    issues: Object.freeze(issues),
  })
}

export function passwordPolicyError(password: string): string | null {
  const result = assessPassword(password)
  return result.valid ? null : `La contraseña debe incluir: ${result.issues.join(', ')}.`
}

export function assertStrongPassword(password: string): void {
  const message = passwordPolicyError(password)
  if (message) throw new Error(`XETHKIOZ_PASSWORD_POLICY: ${message}`)
}
