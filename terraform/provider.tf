provider "aws" {
  region = "ap-northeast-1"
}

provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}