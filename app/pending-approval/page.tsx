// approval_flow_frontend/app/pending-approval/page.tsx
"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, FileText, Calendar, User, Eye } from "lucide-react"
import Link from "next/link"
import { getPendingApprovals } from "@/lib/api"
import { format } from "date-fns"

export default function PendingApprovalPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPending = async () => {
      try {
        setIsLoading(true)
        const data = await getPendingApprovals()
        setRequests(data)
      } catch (error) {
        console.error("Failed to fetch pending approvals", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPending()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Por Aprobar" breadcrumbs={[{ label: "Por Aprobar" }]} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Por Aprobar</h1>
              <p className="text-muted-foreground">Solicitudes pendientes de tu aprobación</p>
            </div>
            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
              <Clock className="w-3 h-3 mr-1" />{requests.length} pendientes
            </Badge>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes Pendientes</CardTitle>
              <CardDescription>Revisa y gestiona las siguientes solicitudes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (<p>Cargando...</p>) : requests.length === 0 ? (<p>No tienes solicitudes pendientes.</p>) : (
                requests.map((req) => (
                  <div key={req.id_solicitud} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2 flex-1">
                      <h4 className="font-medium">{req.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{req.descripcion}</p>
                      <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{req.solicitante.nombre}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(req.fecha_creacion), "dd/MM/yyyy")}</span>
                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{req.tipo.nombre}</span>
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