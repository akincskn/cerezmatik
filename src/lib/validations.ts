import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalıdır")
    .regex(/[A-Z]/, "En az bir büyük harf içermelidir")
    .regex(/[0-9]/, "En az bir rakam içermelidir"),
})

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z.string().min(1, "Şifre boş olamaz"),
})

export const firmaBilgileriSchema = z.object({
  companyName: z.string().min(2, "Firma adı en az 2 karakter olmalıdır"),
  domain: z
    .string()
    .min(3, "Alan adı en az 3 karakter olmalıdır")
    .regex(
      /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/,
      "Geçerli bir alan adı girin (örn: ornek.com)"
    ),
  email: z.string().email("Geçerli bir e-posta girin"),
  mersisNo: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{16}$/.test(val),
      "MERSİS numarası 16 haneli olmalıdır"
    ),
  dataController: z.string().min(2, "Veri sorumlusu en az 2 karakter olmalıdır"),
})

export const bannerTasarimiSchema = z.object({
  position: z.enum(["bottom", "top"]),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Geçerli bir renk kodu girin"),
  textColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Geçerli bir renk kodu girin"),
  buttonText: z.string().min(1, "Buton metni boş olamaz").max(30),
  rejectText: z.string().min(1, "Reddet butonu metni boş olamaz").max(30),
  detailText: z.string().min(1, "Detay butonu metni boş olamaz").max(30),
  privacyPolicyUrl: z.string().url("Geçerli bir URL girin").or(z.literal("")),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type FirmaBilgileriInput = z.infer<typeof firmaBilgileriSchema>
export type BannerTasarimiInput = z.infer<typeof bannerTasarimiSchema>
