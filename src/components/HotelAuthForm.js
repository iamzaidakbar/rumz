import React from "react";
import LoginForm from "./forms/LoginForm";
import SignupForm from "./forms/SignupForm";

const HotelAuthForm = ({
  mode = "signup",
  form,
  onChange,
  onSubmit,
  loading,
  error,
  success,
  logoUploading,
  logoError,
  onLogoDrop,
  onLogoSelect,
  onLogoClick,
  onDragOver,
  fileInputRef,
  onRemoveLogo,
}) => {
  if (mode === "login") {
    return (
      <LoginForm
        form={form}
        onChange={onChange}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        success={success}
      />
    );
  }

  return (
    <SignupForm
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      loading={loading}
      error={error}
      success={success}
      logoUploading={logoUploading}
      logoError={logoError}
      onLogoDrop={onLogoDrop}
      onLogoSelect={onLogoSelect}
      onLogoClick={onLogoClick}
      onDragOver={onDragOver}
      fileInputRef={fileInputRef}
      onRemoveLogo={onRemoveLogo}
    />
  );
};

export default HotelAuthForm;
