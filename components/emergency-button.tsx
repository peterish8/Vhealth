"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, FileText, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmergencyButton() {
  const [showWarning, setShowWarning] = useState(false);
  const router = useRouter();

  const handleEmergencyAccess = () => {
    setShowWarning(true);
    setTimeout(() => {
      router.push("/patient/emergency-summary");
    }, 1000);
  };

  if (showWarning) {
    return (
      <Card className="bg-emergency/10 border-emergency/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-emergency">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            Loading Emergency Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Loading important medical records...
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-emergency rounded-full animate-pulse"></div>
            <span className="text-xs text-emergency">Please wait...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-emergency/5 border-emergency/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-emergency">
          <AlertTriangle className="h-5 w-5" />
          Emergency Summary
        </CardTitle>
        <CardDescription>
          Quick access to critical medical records
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          View your important medical records like prescriptions, CT scans, and
          discharge summaries in one place.
        </p>
        <Button
          onClick={handleEmergencyAccess}
          className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground"
        >
          <FileText className="h-4 w-4 mr-2" />
          View Emergency Summary
        </Button>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>All access is logged for security</span>
        </div>
      </CardContent>
    </Card>
  );
}
