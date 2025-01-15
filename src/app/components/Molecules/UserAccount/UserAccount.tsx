"use client"

import * as React from "react"
import { CreditCard, LogOut, Settings, User, Bell, Crown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/Atomic/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/Atomic/avatar"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/app/components/Atomic/sidebar"

interface UserAccountProps {
  user: {
    name: string
    email: string
    image?: string
  }
}

export function UserAccount({ user }: UserAccountProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="w-full">
              <Avatar className="size-8">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" side="right">
        <DropdownMenuItem>
          <Crown className="mr-2 size-4" />
          アップグレード
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 size-4" />
          アカウント
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className="mr-2 size-4" />
          課金
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bell className="mr-2 size-4" />
          通知
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 size-4" />
          設定
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 size-4" />
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

