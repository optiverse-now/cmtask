"use client"

import * as React from "react"
import { CreditCard, LogOut, Settings, User, Bell, Crown } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation';
import { useProject } from '@/app/contexts/ProjectContext';

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
  const router = useRouter();
  const supabase = createClient();
  const { clearProjects } = useProject();
  
  // ログアウトの処理を追加
  const logOut = async () => {
    // プロジェクトの状態をクリア
    clearProjects();
    // supabaseに用意されているログアウトの関数
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
    // ログアウトを反映させるためにリロードさせる
    router.push('/auth/login')
  }


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
          アップグレード(未実装)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 size-4" />
          アカウント(未実装)
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className="mr-2 size-4" />
          プラン(未実装)
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bell className="mr-2 size-4" />
          通知(未実装)
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 size-4" />
          設定(未実装)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logOut}>
          <LogOut
            className="mr-2 size-4"/>
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

