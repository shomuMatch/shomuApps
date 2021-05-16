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

# resource "aws_s3_bucket_object" "frontend_files" {
#   for_each     = fileset("frontend/video-meeting/build/", "**")
#   bucket       = aws_s3_bucket.frontend.id
#   key          = each.value
#   source       = "frontend/video-meeting/build/${each.value}"
#   content_type = "text/html"
#   etag         = filemd5("frontend/video-meeting/build/${each.value}")
# }
