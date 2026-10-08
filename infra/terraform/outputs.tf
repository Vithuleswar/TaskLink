output "alb_dns_name" {
  description = "Public DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "cloudfront_domain_name" {
  description = "CloudFront CDN domain name for worker before/after portfolio images"
  value       = aws_cloudfront_distribution.portfolio_cdn.domain_name
}

output "rds_endpoint" {
  description = "RDS PostgreSQL PostGIS host endpoint"
  value       = aws_db_instance.postgres.endpoint
  sensitive   = true
}

output "s3_portfolio_bucket" {
  description = "S3 bucket for worker portfolios"
  value       = aws_s3_bucket.portfolios.id
}

output "secrets_manager_arn" {
  description = "ARN of AWS Secrets Manager secret"
  value       = aws_secretsmanager_secret.app_secrets.arn
}
