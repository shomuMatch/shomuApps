terraform {
  backend "s3" {
    bucket = "shomuapps-backend"
    key    = "state/service"
    region = "ap-northeast-1"
  }
}