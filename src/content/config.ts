import { defineCollection, reference, z } from "astro:content";
import type { SchemaContext } from "astro:content";

// --- ENUMS (Vocabulario Controlado) ---
const EntityType = z.enum(["Toon", "Twisted"]);
const RarityType = z.enum(["Common", "Main", "Event", "Lethal"]);
const RoleType = z.enum(["Extractor", "Distractor", "Support", "Survivalist"]);

// --- SUB-ESQUEMAS (Para mantener el código limpio) ---

// Estadísticas detalladas (Separamos Rating visual de Data Real)
const StatsSchema = z.object({
  health: z.object({
    rating: z.number().min(1).max(5),
    hearts: z.number(), // Ej: 2
  }),
  skillCheck: z.object({
    rating: z.number().min(1).max(5),
    data: z.object({
      chance: z.number(), // % (ej: 25)
      size: z.number(), // (ej: 100)
      value: z.number(), // (ej: 1.50)
      speed: z.number(), // (ej: 2)
    }),
  }),
  movementSpeed: z.object({
    rating: z.number().min(1).max(5),
    data: z.object({
      walk: z.number(),
      sprint: z.number(),
    }),
  }),
  stamina: z.object({
    rating: z.number().min(1).max(5),
    value: z.number(), // Ej: 150
  }),
  stealth: z.object({
    rating: z.number().min(1).max(5),
    range: z.number(), // Ej: 20
  }),
  extractionSpeed: z.object({
    rating: z.number().min(1).max(5),
    multiplier: z.number(), // Ej: 1.00
  }),
});

// Esquema Base (Compartido por Toons y Twisteds)
const BaseCharacter = ({ image }: SchemaContext) =>
  z.object({
    id: z.string(),
    code: z.string(), // MN-01
    name: z.string(),
    fullName: z.string().optional(),

    // Jerarquía y Roles
    species: EntityType, // Toon o Twisted
    rarity: RarityType, // Main, Common, etc.
    roles: z.array(RoleType).optional(), // Array porque puede ser Extractor Y Support

    releaseDate: z.date(),
    gender: z.enum(["Male", "Female", "Non-Binary", "Unknown"]),
    description: z.string(),

    // Assets base
    assets: z.object({
      avatar: image(),
      fullBody: image(),
    }),
  });

// --- SCHEMA PRINCIPAL ---
const charactersCollection = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.discriminatedUnion("species", [
      // 1. ESQUEMA PARA "TOONS" (Jugables)
      BaseCharacter({ image }).extend({
        species: z.literal("Toon"),

        // Stats de Jugador
        stats: StatsSchema,

        // Habilidades
        abilities: z.array(
          z.object({
            name: z.string(),
            slug: z.string(), // nap_time (para URLs)
            type: z.enum(["Active", "Passive"]),
            description: z.string(),
            cooldown: z.number().optional(), // Segundos (Solo activa)
            duration: z.number().optional(), // Si aplica
            icon: image().optional(),
          })
        ),

        // Maestría (Solo los Toons tienen esto)
        mastery: z.object({
          tasks: z.array(z.string()), // Lista de tareas simple
          reward: z.object({
            skinName: z.string(),
            skinImage: image().optional(),
          }),
        }),

        // Skins
        skins: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              image: image(),
            })
          )
          .optional(),

        // Extras
        audio: z
          .array(
            z.object({
              file: z.string(), // Path al archivo mp3 (z.string porque image() no valida audio aun)
              description: z.string(),
              type: z.enum(["Ability", "Voice", "Interaction"]).optional(),
            })
          )
          .optional(),

        trinket: z
          .object({
            name: z.string(),
            image: image(),
          })
          .optional(),

        // Requisitos de compra
        unlock: z.object({
          cost: z.number(),
          currency: z.enum(["Ichor", "Tapes"]),
          requirements: z.array(z.string()), // Strings simples para la UI
        }),

        relatedTwisted: reference("characters").optional(),
      }),

      // 2. ESQUEMA PARA "TWISTEDS" (Enemigos)
      BaseCharacter({ image }).extend({
        species: z.literal("Twisted"),

        // Los Twisted tienen stats diferentes (Velocidad de caza, radio de terror, etc.)
        // Definiremos esto más adelante cuando tengas datos de Twisted,
        // por ahora dejamos un objeto libre para no bloquearte.
        twistStats: z.record(z.any()).optional(),
      }),
    ]),
});

export const collections = {
  characters: charactersCollection,
};
