import { z } from 'zod';

// 1. Define the validation schema (runtime)
export const ParallaxMetaSchema = z.object({
    building_height: z.number(),
});

// 2. Automatically extract this TypeScript type from it (compile-time)
// This replaces manually writing: interface ParallaxItemAssetInterface { building_height: number }
export type ParallaxItemAssetInterface = z.infer<typeof ParallaxMetaSchema>;