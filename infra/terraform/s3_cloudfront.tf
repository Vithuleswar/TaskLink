resource "aws_s3_bucket" "portfolios" {
  bucket        = "${var.project_name}-portfolios-${var.environment}-ap-south-1"
  force_destroy = var.environment == "staging" ? true : false

  tags = {
    Name        = "${var.project_name}-portfolios"
    Description = "Storage for verified worker before/after job portfolios (PPT F11)"
  }
}

resource "aws_s3_bucket_versioning" "portfolios" {
  bucket = aws_s3_bucket.portfolios.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "portfolios" {
  bucket = aws_s3_bucket.portfolios.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "portfolios" {
  bucket                  = aws_s3_bucket.portfolios.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "portfolios" {
  bucket = aws_s3_bucket.portfolios.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# CloudFront Origin Access Control (OAC)
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${var.project_name}-oac"
  description                       = "OAC for worker portfolio S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution for Worker Portfolios
resource "aws_cloudfront_distribution" "portfolio_cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront CDN for TaskLink Worker Before/After Portfolios"
  default_root_object = ""

  origin {
    domain_name              = aws_s3_bucket.portfolios.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.portfolios.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.portfolios.id}"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["IN"] # India DPDP Act compliance
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "${var.project_name}-portfolio-cdn"
  }
}

resource "aws_s3_bucket_policy" "portfolios" {
  bucket = aws_s3_bucket.portfolios.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipalReadOnly"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.portfolios.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.portfolio_cdn.arn
          }
        }
      }
    ]
  })
}
