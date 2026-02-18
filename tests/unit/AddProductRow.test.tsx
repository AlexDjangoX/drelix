/**
 * Unit tests for AddProductRow.
 * Mocks only Convex (useQuery, useMutation) and toast as external APIs. Tests actual form and submit logic.
 */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddProductRow } from "@/components/admin/AddProductRow";

const mockUseQuery = vi.fn();
const mockCreateProduct = vi.fn();
const mockToastLoading = vi.fn(() => "toast-id");
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock("convex/react", () => ({
  useQuery: (query: unknown, args: unknown) => mockUseQuery(query, args),
  useMutation: () => mockCreateProduct,
}));

vi.mock("sonner", () => ({
  toast: {
    loading: (msg: string) => mockToastLoading(msg),
    success: (msg: string, opts?: { id?: string }) => mockToastSuccess(msg, opts),
    error: (msg: string, opts?: { id?: string }) => mockToastError(msg, opts),
  },
}));

describe("AddProductRow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockReturnValue([]);
  });

  const renderInTable = (ui: React.ReactElement) =>
    render(
      <table>
        <tbody>{ui}</tbody>
      </table>,
    );

  it("renders expand button when collapsed", () => {
    renderInTable(<AddProductRow categorySlug="gloves" />);
    expect(screen.getByTestId("add-product-row-expand")).toBeInTheDocument();
    expect(screen.getByTestId("add-product-row-expand")).toHaveTextContent(/dodaj produkt/i);
    expect(screen.queryByTestId("add-product-row-form")).not.toBeInTheDocument();
  });

  it("shows form with subcategory select and inputs when expand clicked", () => {
    renderInTable(<AddProductRow categorySlug="gloves" />);
    fireEvent.click(screen.getByTestId("add-product-row-expand"));

    expect(screen.getByTestId("add-product-row-form")).toBeInTheDocument();
    expect(screen.getByTestId("subcategory-select")).toBeInTheDocument();
    expect(screen.getByTestId("add-product-row-input-Kod")).toBeInTheDocument();
    expect(screen.getByTestId("add-product-row-input-Nazwa")).toBeInTheDocument();
    expect(screen.getByTestId("add-product-row-submit")).toBeInTheDocument();
    expect(screen.getByTestId("add-product-row-cancel")).toBeInTheDocument();
  });

  it("validates Kod and Nazwa required and shows toast error on empty submit", async () => {
    renderInTable(<AddProductRow categorySlug="gloves" />);
    fireEvent.click(screen.getByTestId("add-product-row-expand"));
    fireEvent.click(screen.getByTestId("add-product-row-submit"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Kod i Nazwa są wymagane",
        undefined,
      );
    });
    expect(mockCreateProduct).not.toHaveBeenCalled();
  });

  it("calls createProduct with categorySlug, row, and optional subcategorySlug on valid submit", async () => {
    mockCreateProduct.mockResolvedValue({ ok: true });

    renderInTable(<AddProductRow categorySlug="gloves" />);
    fireEvent.click(screen.getByTestId("add-product-row-expand"));

    fireEvent.change(screen.getByTestId("add-product-row-input-Kod"), {
      target: { value: "G-001" },
    });
    fireEvent.change(screen.getByTestId("add-product-row-input-Nazwa"), {
      target: { value: "Test gloves" },
    });
    fireEvent.click(screen.getByTestId("add-product-row-submit"));

    await waitFor(() => {
      expect(mockToastLoading).toHaveBeenCalledWith("Dodawanie produktu...");
    });
    await waitFor(() => {
      expect(mockCreateProduct).toHaveBeenCalledWith({
        categorySlug: "gloves",
        row: expect.objectContaining({
          Kod: "G-001",
          Nazwa: "Test gloves",
        }),
        subcategorySlug: undefined,
      });
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("Produkt został dodany", { id: "toast-id" });
  });

  it("passes subcategorySlug when a subcategory is selected", async () => {
    mockUseQuery.mockReturnValue([
      { slug: "gumowe", displayName: "Gumowe", order: 1 },
    ]);
    mockCreateProduct.mockResolvedValue({ ok: true });

    renderInTable(<AddProductRow categorySlug="gloves" />);
    fireEvent.click(screen.getByTestId("add-product-row-expand"));

    fireEvent.change(screen.getByTestId("add-product-row-input-Kod"), {
      target: { value: "G-002" },
    });
    fireEvent.change(screen.getByTestId("add-product-row-input-Nazwa"), {
      target: { value: "Nitrile gloves" },
    });
    fireEvent.change(screen.getByTestId("subcategory-select"), {
      target: { value: "gumowe" },
    });
    fireEvent.click(screen.getByTestId("add-product-row-submit"));

    await waitFor(() => {
      expect(mockCreateProduct).toHaveBeenCalledWith({
        categorySlug: "gloves",
        row: expect.objectContaining({ Kod: "G-002", Nazwa: "Nitrile gloves" }),
        subcategorySlug: "gumowe",
      });
    });
  });

  it("cancel button collapses form and clears state", () => {
    renderInTable(<AddProductRow categorySlug="gloves" />);
    fireEvent.click(screen.getByTestId("add-product-row-expand"));
    fireEvent.change(screen.getByTestId("add-product-row-input-Kod"), {
      target: { value: "X" },
    });
    fireEvent.click(screen.getByTestId("add-product-row-cancel"));

    expect(screen.queryByTestId("add-product-row-form")).not.toBeInTheDocument();
    expect(screen.getByTestId("add-product-row-expand")).toBeInTheDocument();
  });

  it("expand button is disabled when disabled prop is true", () => {
    renderInTable(<AddProductRow categorySlug="gloves" disabled />);
    expect(screen.getByTestId("add-product-row-expand")).toBeDisabled();
  });
});
