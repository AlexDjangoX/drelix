"use client";

import { useState } from "react";
import { ImageUploadCell } from "@/components/admin/ImageUploadCell";
import { DeleteProductButton } from "@/components/admin/ProductRow/DeleteProductButton";
import { ProductRowActions } from "@/components/admin/ProductRow/ProductRowActions";
import { ProductRowFields } from "@/components/admin/ProductRow/ProductRowFields";
import { EditProductModal } from "@/components/admin/EditProductModal";
import type { CatalogRow } from "@/lib/types";

type Props = { row: CatalogRow };

export function ProductRow({ row }: Props) {
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/30">
        <td className="p-2 align-middle border-r border-border/50 text-center">
          <div className="flex justify-center">
            <ImageUploadCell row={row} />
          </div>
        </td>
        <td className="p-2 align-middle border-r border-border/50 w-40 text-center">
          <div className="flex flex-col items-center justify-center gap-2 w-full">
            <ProductRowActions onEdit={() => setEditModalOpen(true)} />
            <DeleteProductButton kod={row["Kod"] ?? ""} disabled={false} />
          </div>
        </td>
        <ProductRowFields
          editing={false}
          row={row}
          draft={row}
          saving={false}
          onFieldChange={() => {}}
        />
      </tr>
      <EditProductModal
        row={row}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </>
  );
}
