// approval_flow_frontend/app/admin/users/page.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, User, Shield } from "lucide-react"
import Link from "next/link"
import { getUsers, createUser } from "@/lib/api"

// ... (Interface para el Usuario, si se necesita)

export default function UsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    nombre: "",
    email: "",
    username: "",
    password_hash: "",
    id_rol: "2", // 1: Admin, 2: Standard por defecto
  })

  useEffect(() => {
    if (user?.rol.nombre !== "Administrador") {
      router.push("/")
    } else {
      fetchUsers()
    }
  }, [user, router])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUser({ ...newUser, id_rol: parseInt(newUser.id_rol, 10) })
      setNewUser({ nombre: "", email: "", username: "", password_hash: "", id_rol: "2" })
      setIsDialogOpen(false)
      fetchUsers() // Refresh user list
    } catch (error) {
      console.error("Failed to create user", error)
      // Aquí se podría mostrar un mensaje de error al usuario
    }
  }

  if (user?.rol.nombre !== "Administrador") {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Gestión de Usuarios" breadcrumbs={[{ label: "Administración" }, { label: "Gestión de Usuarios" }]} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
                <p className="text-muted-foreground">Administra los usuarios del sistema</p>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  <DialogDescription>Completa los datos para crear un nuevo usuario en el sistema</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input id="name" value={newUser.nombre} onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })} required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" type="password" value={newUser.password_hash} onChange={(e) => setNewUser({ ...newUser, password_hash: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select value={newUser.id_rol} onValueChange={(value) => setNewUser({ ...newUser, id_rol: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">Usuario</SelectItem>
                        <SelectItem value="1">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit">Crear Usuario</Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}> Cancelar </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usuarios del Sistema</CardTitle>
              <CardDescription>Lista de todos los usuarios registrados</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Cargando usuarios...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id_usuario}>
                        <TableCell className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{user.nombre}</span>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.rol.nombre === "Administrador" ? "default" : "secondary"}>
                            {user.rol.nombre === "Administrador" ? (
                              <><Shield className="w-3 h-3 mr-1" />Administrador</>
                            ) : (
                              <><User className="w-3 h-3 mr-1" />Usuario</>
                            )}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}