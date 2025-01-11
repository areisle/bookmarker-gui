declare var global: { browser: (typeof window)['chrome'] | undefined; }
declare module "*.png" {
    const value: string;
    export default value;
}