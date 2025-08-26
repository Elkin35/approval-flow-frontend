// approval_flow_frontend/app/rejected/page.tsx
"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XCircle, FileText, Calendar, User, Eye, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getMyRequests } from "@/lib/api"
import { format } from "date-fns"

export default function RejectedPage() {
  const [rejectedRequests, setRejectedRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true)
        const allMyRequests = await getMyRequests()
        setRejectedRequests(allMyRequests.filter((req: any) => req.estadoActual.nombre === "Rechazado"))
      } catch (error) {
        console.error("Failed to fetch rejected requests", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequests()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Solicitudes Rechazadas" breadcrumbs={[{ label: "Estados" }, { label: "Rechazadas" }]} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Solicitudes Rechazadas</h1>
              <p className="text-muted-foreground">Historial de tus solicitudes rechazadas</p>
            </div>
            <Badge variant="outline" className="text-red-600 border-red-600">
              <XCircle className="w-3 h-3 mr-1" />{rejectedRequests.length} rechazadas
            </Badge>
          </div>
          <Card>
            <CardHeader><CardTitle>Solicitudes Rechazadas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (<p>Cargando...</p>) : rejectedRequests.length === 0 ? (<p>No tienes solicitudes rechazadas.</p>) : (
                rejectedRequests.map((req) => (
                  <div key={req.id_solicitud} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2 flex-1">
                      <h4 className="font-medium">{req.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{req.descripcion}</p>
                      {/* Nota: el motivo del rechazo está en el historial, aquí lo simplificamos */}
                      <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />Rechazado por: {req.aprobadores.map((a: any) => a.nombre).join(', ')}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Creado: {format(new Date(req.fecha_creacion), "dd/MM/yyyy")}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/request/${req.id_solicitud}`}><Eye className="w-4 h-4" /></Link>
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}