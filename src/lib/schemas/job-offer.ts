import { z } from 'zod';

export const jobOfferInputSchema = z.object({
  currentSalary: z.number().min(0),
  offerSalary: z.number().min(0),
  commuteMinutes: z.number().min(0).max(240),
  overtimeHoursPerWeek: z.number().min(0).max(80),
  growthScore: z.number().min(1).max(10),
  riskTolerance: z.number().min(1).max(10),
  stabilityNeed: z.number().min(1).max(10),
  nonNegotiables: z.array(z.string().max(80)).length(3),
  narrative: z.string().max(2000).optional(),
});

export type JobOfferInput = z.infer<typeof jobOfferInputSchema>;
