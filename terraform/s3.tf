resource "aws_s3_bucket" "frontend" {
  bucket = "${local.project_name}-frontend"
  acl    = "private"

  tags = {
    Name    = "${local.project_name}-frontend"
    Project = local.project_name
  }
}

resource "aws_s3_bucket_policy" "frontend_s3_policy" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.frontend_bucket_policy.json
}
