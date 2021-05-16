resource "aws_route53_zone" "shomapps" {
  name = local.root_domain
  tags = {
    Name    = local.project_name
    Project = local.project_name
  }
}

resource "aws_route53_record" "root_record" {
  zone_id = aws_route53_zone.shomapps.zone_id
  name    = local.root_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.frontend_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}




resource "aws_route53_record" "acm_cert" {

  for_each = {
    for dvo in aws_acm_certificate.acm_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  name            = each.value.name
  records         = [each.value.record]
  type            = each.value.type
  zone_id         = aws_route53_zone.shomapps.id
  ttl             = 60
  allow_overwrite = true
}