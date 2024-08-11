import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    rollup: {
        inlineDependencies: true, 
        emitCJS: true
     },
    declaration: false,
    entries: [
        {
            builder: "rollup",
            input:'./src/index',
            outDir: './dist',
        }
    ],
})