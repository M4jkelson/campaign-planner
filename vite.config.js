import { defineConfig } from "vite";

export default defineConfig({
	build: {
		outDir: "dist/my-vite-template/browser", // Upewnij się, że ścieżki są zgodne z folderem, do którego publikujesz
		assetsDir: "assets",
	},
	base: "/capaign-project-angular/",
});
