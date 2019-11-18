Package.describe({
  name: "email",
  version: "1.2.3",
  summary: "Replace Meteors Email.send method to use AWS SES directly"
});

Package.onUse(function(api) {
  api.use(["coffeescript", "check", "stevezhu:lodash"]);
  Npm.depends({
    node4mailer: "4.0.3",
    "aws-sdk": "2.82.0"
  });
  api.addFiles(["email.coffee"], "server");
  api.export("Email", "server");
});
