"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Trash2, RefreshCw } from "lucide-react"

interface Props {
  siteId: string
  companyName: string
}

export function DeleteSiteButton({ siteId, companyName }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/sites/${siteId}`, { method: "DELETE" })
      const json = await res.json()

      if (!json.success) {
        toast({ title: "Hata", description: json.error, variant: "destructive" })
        return
      }

      toast({ title: "Silindi", description: `${companyName} başarıyla silindi.` })
      router.push("/panel")
      router.refresh()
    } catch {
      toast({ title: "Hata", description: "Silinemedi, tekrar deneyin.", variant: "destructive" })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          disabled={deleting}
        >
          {deleting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Sil
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Siteyi sil?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{companyName}</strong> için oluşturulan cookie banner, çerez politikası
            ve aydınlatma metni kalıcı olarak silinecektir. Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Vazgeç</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Evet, Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
