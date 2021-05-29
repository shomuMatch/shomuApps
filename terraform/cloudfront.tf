resource "aws_cloudfront_distribution" "frontend_distribution" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = local.s3_origin_id
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_idntity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  default_root_object = "index.html"
  wait_for_deployment = true

  aliases = [local.root_domain]

  # SSL証明書。ACMを使用する場合はここで指定すると利用可能です
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.acm_cert.certificate_arn
    minimum_protocol_version = "TLSv1"
    ssl_support_method       = "sni-only"
  }

  # 404エラー時に返すファイル
  custom_error_response {
    error_code         = "404"
    response_code      = "200"
    response_page_path = "/index.html"
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id
    compress               = true
    viewer_protocol_policy = "allow-all"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_cloudfront_origin_access_identity" "origin_access_idntity" {
  comment = "access-identity-${local.project_name}.s3.amazonaws.com"
}