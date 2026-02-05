import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { CardContent } from "@/components/ui/card";
import { FormField } from "@/components/layout/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/layout/image-upload";
import { useForm } from "react-hook-form";
import { SystemSettings, SystemSettingsSchema } from "@/schemas/system.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Save, UploadIcon, X } from "lucide-react";
import { uploadFile } from "@/services/upload.service";
import {  } from "@/services/system.service";
import { Switch } from "../ui/switch";

const StatusTab = () => {


    return (
        <TabsContent value="status">
            <CardContent className="space-y-6">
                <div className="flex justify-between items-center border rounded-lg p-4">
                    <div>
                        <p className="font-medium">
                            Trạng thái hệ thống
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Bật/tắt toàn bộ website
                        </p>
                    </div>
                    <Switch />
                </div>

                <FormField label="Thông báo bảo trì">
                    <Textarea rows={3} />
                </FormField>
            </CardContent>
        </TabsContent>
    );
};

export default StatusTab;
