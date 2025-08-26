// approval_flow_frontend/components/dashboard.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, FileText, Plus, Eye, Calendar, User } from "lucide-react"
import Link from "next/link"
import { getMyRequests, getPendingApprovals } from "@/lib/api"
import { format } from "date-fns"

function getStatusBadge(status: string) {
  switch (status) {
    case "Pendiente":
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>
    case "Aprobado":
      return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Aprobado</Badge>
    case "Rechazado":
      return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Rechazado</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function Dashboard() {
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, myRequests: 0 })
  const [myRecentRequests, setMyRecentRequests] = useState<any[]>([])
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const [myRequestsData, pendingApprovalsData] = await Promise.all([
          getMyRequests(),
          getPendingApprovals(),
        ])

        setMyRecentRequests(myRequestsData.slice(0, 3))
        setPendingApprovals(pendingApprovalsData.slice(0, 3))

        setStats({
          pending: pendingApprovalsData.length,
          approved: myRequestsData.filter((r: any) => r.estadoActual.nombre === "Aprobado").length,
          rejected: myRequestsData.filter((r: any) => r.estadoActual.nombre === "Rechazado").length,
          myRequests: myRequestsData.length,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Gestiona tus solicitudes de aprobación</p>
        </div>
        <Button asChild className="bg-secondary hover:bg-secondary/90">
          <Link href="/new-request"><Plus className="w-4 h-4 mr-2" />Nueva Solicitud</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes por Aprobar</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.pending}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.approved}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.rejected}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis Solicitudes</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.myRequests}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Mis Solicitudes Recientes</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (<p>Cargando...</p>) : myRecentRequests.map((req) => (
              <div key={req.id_solicitud} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2"><h4 className="font-medium">{req.titulo}</h4>{getStatusBadge(req.estadoActual.nombre)}</div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(req.fecha_creacion), "dd/MM/yyyy")}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{req.tipo.nombre}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild><Link href={`/request/${req.id_solicitud}`}><Eye className="w-4 h-4" /></Link></Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pendientes de Mi Aprobación</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (<p>Cargando...</p>) : pendingApprovals.map((req) => (
              <div key={req.id_solicitud} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{req.titulo}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{req.solicitante.nombre}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(req.fecha_creacion), "dd/MM/yyyy")}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild><Link href={`/request/${req.id_solicitud}`}><Eye className="w-4 h-4" /></Link></Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}