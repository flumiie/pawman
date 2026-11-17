# THIS FILE IS AUTO-GENERATED. DO NOT MODIFY!!

# Copyright 2020-2023 Tauri Programme within The Commons Conservancy
# SPDX-License-Identifier: Apache-2.0
# SPDX-License-Identifier: MIT

-keep class com.flumi.pawman.* {
  native <methods>;
}

-keep class com.flumi.pawman.WryActivity {
  public <init>(...);

  void setWebView(com.flumi.pawman.RustWebView);
  java.lang.Class getAppClass(...);
  int getId();
  java.lang.String getVersion();
  int startActivity(...);
}

-keep class com.flumi.pawman.Ipc {
  public <init>(...);

  @android.webkit.JavascriptInterface public <methods>;
}

-keep class com.flumi.pawman.RustWebView {
  public <init>(...);

  void loadUrlMainThread(...);
  void loadHTMLMainThread(...);
  void evalScript(...);
  java.lang.String getCookies(java.lang.String);
  void clearAllBrowsingData();
}

-keep class com.flumi.pawman.RustWebChromeClient,com.flumi.pawman.RustWebViewClient {
  public <init>(...);
}
