# Some potential new features

- Add include and exclude functions to the `RouteMiddleware` class to create new instances with certain middleware either included or excluded
- Explore using/integrating this API with the standard Next.js middleware
- Add a base class for handlers that automatically binds its HTTP methods
  - These could store an array of the methods bound so that the RouteMiddleware doesn't have to inspect, potentially improving consistency across environments/platforms
- Create middleware packages that depend on this library and reference them in the README.md
- Add in badges
