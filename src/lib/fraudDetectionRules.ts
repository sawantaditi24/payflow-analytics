/**
 * Fraud Detection Business Rules
 * 
 * This file contains the business logic for detecting fraudulent transactions.
 * These rules are based on common fraud patterns used in the payment industry.
 */

export interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'succeeded' | 'failed' | 'pending'
  customer: string
  timestamp: string
  method: string
  location?: string // Optional: customer's location
}

export interface FraudAlert {
  id: string
  type: 'high_amount' | 'unusual_location' | 'rapid_transactions' | 'suspicious_pattern'
  severity: 'high' | 'medium' | 'low'
  description: string
  amount: number
  customer: string
  timestamp: string
  status: 'investigating' | 'resolved' | 'false_positive'
  rule?: string // Which rule was triggered
}

/**
 * BUSINESS RULE 1: High Amount Detection
 * 
 * Rule: Flag transactions above $1,000 as potentially fraudulent
 * Reason: Fraudsters often test stolen cards with large amounts
 * Severity: HIGH - Large fraudulent transactions cause significant financial loss
 * 
 * Threshold: $1,000
 */
export function checkHighAmount(transaction: Transaction): FraudAlert | null {
  const HIGH_AMOUNT_THRESHOLD = 1000
  
  if (transaction.amount > HIGH_AMOUNT_THRESHOLD) {
    return {
      id: `alert_${transaction.id}_high_amount`,
      type: 'high_amount',
      severity: 'high',
      description: `Unusually high transaction amount detected: $${transaction.amount.toFixed(2)}`,
      amount: transaction.amount,
      customer: transaction.customer,
      timestamp: transaction.timestamp,
      status: 'investigating',
      rule: `Amount exceeds threshold of $${HIGH_AMOUNT_THRESHOLD}`
    }
  }
  
  return null
}

/**
 * BUSINESS RULE 2: Unusual Location Detection
 * 
 * Rule: Flag transactions from geographic locations customer never used before
 * Reason: Stolen cards are often used in different countries
 * Severity: MEDIUM - Could be legitimate travel or fraudulent activity
 * 
 * In production: Would check customer's transaction history for location patterns
 */
export function checkUnusualLocation(transaction: Transaction, customerHistory: string[]): FraudAlert | null {
  // In production, this would check actual customer location history
  // For demo: Simulate detecting new location for 30% of transactions
  
  if (Math.random() < 0.3) {
    return {
      id: `alert_${transaction.id}_location`,
      type: 'unusual_location',
      severity: 'medium',
      description: `Transaction from new geographic location detected`,
      amount: transaction.amount,
      customer: transaction.customer,
      timestamp: transaction.timestamp,
      status: 'investigating',
      rule: 'Payment location differs from customer\'s usual locations'
    }
  }
  
  return null
}

/**
 * BUSINESS RULE 3: Rapid Transactions Detection
 * 
 * Rule: Flag multiple transactions within short time period (e.g., 5 in 1 minute)
 * Reason: Fraudsters quickly test stolen cards before they're reported
 * Severity: MEDIUM - Pattern suggests card testing behavior
 * 
 * Threshold: 5 transactions within 60 seconds
 */
export function checkRapidTransactions(
  transaction: Transaction, 
  recentTransactions: Transaction[]
): FraudAlert | null {
  const RAPID_TRANSACTION_THRESHOLD = 5 // transactions
  const TIME_WINDOW = 60000 // 1 minute in milliseconds
  
  // Count transactions from same customer within time window
  const recentSameCustomer = recentTransactions.filter(t => 
    t.customer === transaction.customer &&
    new Date(transaction.timestamp).getTime() - new Date(t.timestamp).getTime() < TIME_WINDOW
  )
  
  if (recentSameCustomer.length >= RAPID_TRANSACTION_THRESHOLD) {
    return {
      id: `alert_${transaction.id}_rapid`,
      type: 'rapid_transactions',
      severity: 'medium',
      description: `Multiple rapid transactions detected: ${recentSameCustomer.length + 1} transactions in ${TIME_WINDOW / 1000} seconds`,
      amount: transaction.amount,
      customer: transaction.customer,
      timestamp: transaction.timestamp,
      status: 'investigating',
      rule: `More than ${RAPID_TRANSACTION_THRESHOLD} transactions within ${TIME_WINDOW / 1000} seconds`
    }
  }
  
  return null
}

/**
 * BUSINESS RULE 4: Suspicious Pattern Detection
 * 
 * Rule: Flag transactions that match multiple suspicious factors
 * Reason: Multiple red flags together indicate higher fraud probability
 * Severity: HIGH - Combination of suspicious factors is highly indicative of fraud
 * 
 * Pattern: High amount + unusual location + rapid transactions
 */
export function checkSuspiciousPattern(
  transaction: Transaction,
  hasHighAmount: boolean,
  hasUnusualLocation: boolean,
  hasRapidTransactions: boolean
): FraudAlert | null {
  // Count how many suspicious factors are present
  const suspiciousFactors = [hasHighAmount, hasUnusualLocation, hasRapidTransactions].filter(Boolean).length
  
  // If 2+ suspicious factors are present, flag as high risk
  if (suspiciousFactors >= 2) {
    return {
      id: `alert_${transaction.id}_pattern`,
      type: 'suspicious_pattern',
      severity: 'high',
      description: `Multiple suspicious factors detected (${suspiciousFactors} indicators)`,
      amount: transaction.amount,
      customer: transaction.customer,
      timestamp: transaction.timestamp,
      status: 'investigating',
      rule: `Combination of ${suspiciousFactors} suspicious factors: ${hasHighAmount ? 'High Amount' : ''} ${hasUnusualLocation ? 'Unusual Location' : ''} ${hasRapidTransactions ? 'Rapid Transactions' : ''}`
    }
  }
  
  return null
}

/**
 * Main fraud detection function
 * 
 * Applies all fraud detection rules to a transaction
 * Returns array of fraud alerts if any rules are triggered
 */
export function detectFraud(
  transaction: Transaction,
  customerHistory: string[] = [],
  recentTransactions: Transaction[] = []
): FraudAlert[] {
  const alerts: FraudAlert[] = []
  
  // Apply each fraud detection rule
  const highAmountAlert = checkHighAmount(transaction)
  const unusualLocationAlert = checkUnusualLocation(transaction, customerHistory)
  const rapidTransactionsAlert = checkRapidTransactions(transaction, recentTransactions)
  
  if (highAmountAlert) alerts.push(highAmountAlert)
  if (unusualLocationAlert) alerts.push(unusualLocationAlert)
  if (rapidTransactionsAlert) alerts.push(rapidTransactionsAlert)
  
  // Check for suspicious pattern (combination of factors)
  const suspiciousPatternAlert = checkSuspiciousPattern(
    transaction,
    !!highAmountAlert,
    !!unusualLocationAlert,
    !!rapidTransactionsAlert
  )
  
  if (suspiciousPatternAlert) {
    alerts.push(suspiciousPatternAlert)
  }
  
  return alerts
}

