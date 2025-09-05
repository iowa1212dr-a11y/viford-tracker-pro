import { Calculator, History, Receipt, ShoppingCart, DollarSign } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { 
    id: "productos", 
    title: "Productos", 
    icon: ShoppingCart,
    description: "Gestionar productos"
  },
  { 
    id: "totales", 
    title: "Totales", 
    icon: DollarSign,
    description: "Ver totales calculados"
  },
  { 
    id: "costos", 
    title: "Costos", 
    icon: Calculator,
    description: "Análisis de costos"
  },
  { 
    id: "presupuesto", 
    title: "Presupuesto", 
    icon: Receipt,
    description: "Generar presupuesto"
  },
  { 
    id: "historial", 
    title: "Historial", 
    icon: History,
    description: "Historial de presupuestos"
  },
];

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Calculator className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">Viford Pro</h2>
            <p className="text-xs text-sidebar-foreground/60">Calculadora de Mallas</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80 font-medium">
            Navegación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full justify-start gap-3 p-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs opacity-60">{item.description}</div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}