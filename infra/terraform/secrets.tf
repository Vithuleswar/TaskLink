resource "aws_secretsmanager_secret" "app_secrets" {
  name                    = "${var.project_name}/credentials/${var.environment}"
  description             = "TaskLink API, Voice & Payment credentials for ap-south-1"
  recovery_window_in_days = 0

  tags = {
    Name = "${var.project_name}-secrets"
  }
}

resource "aws_secretsmanager_secret_version" "app_secrets_val" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    JWT_SECRET            = "replace_with_prod_jwt_secret"
    DATABASE_URL          = "postgresql://${var.db_username}:${random_password.db_password.result}@${aws_db_instance.postgres.endpoint}/${var.db_name}"
    BHASHINI_USER_ID      = "replace_with_bhashini_user_id"
    BHASHINI_API_KEY      = "replace_with_bhashini_api_key"
    BHASHINI_PIPELINE_ID  = "replace_with_bhashini_pipeline_id"
    EXOTEL_ACCOUNT_SID    = "replace_with_exotel_sid"
    EXOTEL_API_KEY        = "replace_with_exotel_key"
    EXOTEL_API_TOKEN      = "replace_with_exotel_token"
    EXOTEL_CALLER_ID      = "replace_with_exotel_virtual_number"
    RAZORPAY_KEY_ID       = "replace_with_razorpay_key_id"
    RAZORPAY_KEY_SECRET   = "replace_with_razorpay_key_secret"
    CASHFREE_APP_ID       = "replace_with_cashfree_app_id"
    CASHFREE_SECRET_KEY   = "replace_with_cashfree_secret_key"
    MAPPLS_CLIENT_ID      = "replace_with_mappls_client_id"
    MAPPLS_CLIENT_SECRET  = "replace_with_mappls_client_secret"
  })
}
