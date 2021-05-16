resource "aws_acm_certificate" "acm_cert" {
  provider                  = aws.virginia
  domain_name               = local.root_domain
  subject_alternative_names = ["*.${local.root_domain}"]
  validation_method         = "DNS"
}

resource "aws_acm_certificate_validation" "acm_cert" {
  certificate_arn         = aws_acm_certificate.acm_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_cert : record.fqdn]
  provider                = aws.virginia
}