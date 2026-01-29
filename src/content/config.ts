import { defineCollection, reference, z } from "astro:content";

// Definimos los Enums para filtros rápidos y sin errores de tipeo
const ClassEnum = z.enum(["Main", "Toon", "Twisted"]);
const RoleEnum = z.enum(["Extractor", "Distractor", "Support", "Survivalist"]); // Ejemplos
const AbilityTypeEnum = z.enum(["Active", "Passive"]);

const characters = defineCollection({
  type: "data", // Usamos JSON o YAML (YAML es más limpio para escribir a mano)
  schema: ({ image }) =>
    z.object({
      // --- IDENTIFICACIÓN ---
      id: z.string(), // Slug único: 'astro'
      code: z.string(),
      name: z.string(),
      aliases: z.array(z.string()).optional(), // Apodos
      releaseDate: z.date(), // Formato ISO real para ordenar cronológicamente

      // --- CLASIFICACIÓN (Vital para filtros) ---
      category: ClassEnum,
      role: RoleEnum.optional(), // Algunos quizás no tengan rol definido aún
      gender: z.enum(["Male", "Female", "Non-Binary", "Unknown"]),

      // --- ASSETS (Optimización automática de imágenes) ---
      // Usar el helper 'image()' valida que la imagen exista en tu carpeta.
      assets: z.object({
        avatar: image(),
        fullBody: image(),
        icon: image().optional(), // Para el minimapa o UI
      }),

      // --- STATS COMPLEJOS (Lo que pediste) ---
      // Separamos las "Estrellas" (UI) de los "Valores" (Lógica)
      stats: z.object({
        ratings: z.object({
          // Las estrellas que se ven en la carta (1-5)
          health: z.number().min(1).max(5),
          skillCheck: z.number().min(1).max(5),
          movementSpeed: z.number().min(1).max(5),
          stamina: z.number().min(1).max(5),
          stealth: z.number().min(1).max(5),
          extractionSpeed: z.number().min(1).max(5),
        }),
        raw: z
          .object({
            // Los datos técnicos para los nerds de la wiki
            healthPoints: z.number(), // Ej: 2 hearts
            staminaPoints: z.number(), // Ej: 150
            walkSpeed: z.number(), // Ej: 15
            sprintSpeed: z.number(), // Ej: 25
          })
          .optional(), // Opcional por si algún dato no se conoce aún
      }),

      // --- HABILIDADES (Polimórficas) ---
      abilities: z
        .array(
          z.object({
            name: z.string(),
            slug: z.string(), // Para anchors
            type: AbilityTypeEnum,
            icon: image().optional(), // Icono de la habilidad
            description: z.string(),
            cooldown: z.number().optional(), // Solo si es activa
            duration: z.number().optional(), // Duración del efecto
          })
        )
        .max(2), // Máximo 2 habilidades por Toon

      // --- SISTEMA DE DESBLOQUEO (Estructurado) ---
      unlock: z.object({
        purchasable: z.boolean(),
        cost: z.number().optional(), // Cantidad de Ichor
        currency: z.enum(["Ichor", "Tapes"]).default("Ichor"),
        requirements: z
          .array(
            z.object({
              type: z.enum(["Research", "Encounter", "Quest", "Item"]),
              target: z.string(), // "Twisted Astro", "Dandy", etc.
              value: z.number().optional(), // "100%", "1 vez", etc.
              description: z.string(), // Texto legible para mostrar
            })
          )
          .optional(),
      }),

      // --- MAESTRÍA (Gamification) ---
      mastery: z
        .object({
          tasks: z.array(
            z.object({
              description: z.string(), // "Usa la habilidad 100 veces"
              count: z.number(), // 100
              progressType: z.enum([
                "Use",
                "Buy",
                "Run",
                "Blackout",
                "Collect",
              ]),
            })
          ),
          reward: z.object({
            skinName: z.string(), // "Vintage Astro"
            skinImage: image().optional(),
          }),
        })
        .optional(),

      // --- RELACIONES (El toque profesional) ---
      // Enlaza automáticamente al archivo del Twisted sin hardcodear URLs
      relatedTwisted: reference("characters").optional(),
      trinket: reference("trinkets").optional(), // Asumiendo que crearás una colección de trinkets

      // --- LORE & MEDIA ---
      description: z.string(),
      voiceLines: z
        .array(
          z.object({
            text: z.string(),
            audio: z.string().optional(), // Path al archivo de audio
            trigger: z.string(), // "On Spawn", "On Hit"
          })
        )
        .optional(),
    }),
});

export const collections = {
  characters: characters,
  // 'trinkets': trinketsCollection... (Futuro)
};
