import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api, ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query/query-config"
import { KycSubmitResponse } from "../types"

// ---------------------------------------------------------------------------
// Helper — convert a base64 data URL to a File object
// ---------------------------------------------------------------------------

/**
 * Converts a base64 data URL (e.g. `data:image/jpeg;base64,...`) into a
 * browser `File` object suitable for `FormData` uploads.
 */
function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(",")
  const mimeMatch = header.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg"
  const byteString = atob(base64)
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new File([ab], filename, { type: mime })
}

// ---------------------------------------------------------------------------
// Input type — accepts base64 data URLs from the webcam PhotoField
// ---------------------------------------------------------------------------

/**
 * Input for `submitKyc`. `idCard` and `selfie` are base64 data URL strings
 * produced by the webcam `PhotoField` component, which are converted to
 * `File` objects internally before the multipart request is sent.
 */
export type SubmitKycPayload = {
  fullName: string
  /** Indonesian NIK — exactly 16 digits */
  nationalId: string
  dateOfBirth?: string
  /** Base64 data URL from the webcam capture */
  idCard: string
  /** Base64 data URL from the webcam capture */
  selfie: string
}

// ---------------------------------------------------------------------------
// API function
// ---------------------------------------------------------------------------

/**
 * `POST /kyc`
 *
 * Submits KYC identity data (full name, NIK, ID card image, selfie) for the
 * currently authenticated user.
 *
 * The request is sent as `multipart/form-data`. On success the status will
 * always be `PENDING`.
 *
 * If the user's previous submission was `REJECTED`, calling this endpoint
 * again will overwrite the old data and reset the status back to `PENDING`.
 */
export const submitKyc = async (data: SubmitKycPayload) => {
  const formData = new FormData()

  formData.append("fullName", data.fullName)
  formData.append("nationalId", data.nationalId)
  if (data.dateOfBirth) {
    formData.append("dateOfBirth", data.dateOfBirth)
  }
  formData.append("idCard", dataUrlToFile(data.idCard, "id-card.jpg"))
  formData.append("selfie", dataUrlToFile(data.selfie, "selfie.jpg"))

  const res = await api.post<ApiResponse<KycSubmitResponse>>("/kyc", formData)
  return res.data
}

// ---------------------------------------------------------------------------
// Mutation hook
// ---------------------------------------------------------------------------

type UseSubmitKycOptions = {
  config?: MutationConfig<typeof submitKyc>
}

export const useSubmitKyc = ({ config }: UseSubmitKycOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitKyc,
    onSuccess: () => {
      // Invalidate the KYC status cache so the UI reflects the new PENDING
      // state immediately after submission.
      queryClient.invalidateQueries({ queryKey: ["kyc", "me"] })
    },
    ...config,
  })
}
