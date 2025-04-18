"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // 인증 상태 확인
  if (typeof window !== "undefined" && !isAuthenticated) {
    router.push("/login");
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 유효성 검사
    if (!file.type.startsWith("image/")) {
      setErrorMessage("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    setImage(file);

    // 이미지 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!image) {
      setErrorMessage("이미지를 선택해주세요.");
      return;
    }

    try {
      // TODO: API 연동 필요
      setSuccessMessage("게시물이 성공적으로 업로드되었습니다.");
      // 폼 초기화
      setTitle("");
      setDescription("");
      setImage(null);
      setImagePreview(null);
      setTags("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // 2초 후 홈페이지로 리다이렉트
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Failed to upload post:", error);
      setErrorMessage("게시물 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#5D4037]">
              사진 업로드
            </CardTitle>
            <CardDescription className="text-[#33691E]">
              마인크래프트 스크린샷이나 창작물을 공유해보세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm mb-4">
                {successMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#5D4037]">
                  제목
                </Label>
                <Input
                  id="title"
                  placeholder="게시물 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-gray-200 bg-white"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#5D4037]">
                  설명
                </Label>
                <Textarea
                  id="description"
                  placeholder="게시물에 대한 설명을 입력하세요"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-gray-200 bg-white min-h-[100px]"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-[#5D4037]">
                  태그
                </Label>
                <Input
                  id="tags"
                  placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 마인크래프트, 건축, 레드스톤)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="border-gray-200 bg-white"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-[#5D4037]">
                  이미지
                </Label>

                {!imagePreview ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      이미지를 선택하거나 여기에 드래그하세요
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF 파일만 지원됩니다 (최대 10MB)
                    </p>
                    <Input
                      id="image"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="미리보기"
                      className="w-full h-auto max-h-[300px] object-contain bg-gray-100"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={handleRemoveImage}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#33691E] hover:bg-[#1B5E20]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    업로드 중...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    업로드
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500">
              업로드한 콘텐츠는 MC Archieve의 커뮤니티 가이드라인을 준수해야
              합니다.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
