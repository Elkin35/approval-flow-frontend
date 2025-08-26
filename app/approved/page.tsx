// approval_flow_frontend/app/approved/page.tsx
"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, FileText, Calendar, User, Eye } from "lucide-react"
import Link from "next/link"
import { getMyRequests } from "@/lib/api"
import { format } from "date-fns"

export default function ApprovedPage() {
  const [approvedRequests, setApprovedRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true)
        const allMyRequests = await getMyRequests()
        setApprovedRequests(allMyRequests.filter((req: any) => req.estadoActual.nombre === "Aprobado"))
      } catch (error) {
        console.error("Failed to fetch approved requests", error)
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
        <AppHeader title="Solicitudes Aprobadas" breadcrumbs={[{ label: "Estados" }, { label: "Aprobadas" }]} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Solicitudes Aprobadas</h1>
              <p className="text-muted-foreground">Historial de tus solicitudes aprobadas</p>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />{approvedRequests.length} aprobadas
            </Badge>
          </div>
          <Card>
            <CardHeader><CardTitle>Solicitudes Aprobadas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (<p>Cargando...</p>) : approvedRequests.length === 0 ? (<p>No tienes solicitudes aprobadas.</p>) : (
                approvedRequests.map((req) => (
                  <div key={req.id_solicitud} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2 flex-1">
                      <h4 className="font-medium">{req.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{req.descripcion}</p>
                      <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />Aprobado por: {req.aprobadores.map((a: any) => a.nombre).join(', ')}</span>
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