// Configuration service for environment variables
export class ConfigService {
  private static config: any = null;

  static getConfig(): any {
    if (!this.config) {
      // Try to get config from window.ENV (Docker environment)
      if (typeof window !== 'undefined' && (window as any).ENV) {
        this.config = (window as any).ENV;
      } else {
        // Fallback to default values
        this.config = {
          BASE_URL: ''
        };
      }
    }
    return this.config;
  }

  static getBaseUrl(): string {
    const config = this.getConfig();
    return config.BASE_URL || '';
  }
}