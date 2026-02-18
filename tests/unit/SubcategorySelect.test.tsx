/**
 * Unit tests for SubcategorySelect.
 * Mocks only Convex (useQuery) as external API. Tests actual render and interaction logic.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SubcategorySelect } from "@/components/admin/SubcategorySelect";

const mockUseQuery = vi.fn();

vi.mock("convex/react", () => ({
  useQuery: (query: unknown, args: unknown) => mockUseQuery(query, args),
}));

describe("SubcategorySelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders disabled select with placeholder when categorySlug is empty", () => {
    mockUseQuery.mockReturnValue(undefined);
    const onSelect = vi.fn();

    render(
      <SubcategorySelect
        categorySlug=""
        currentSlug=""
        onSelect={onSelect}
      />,
    );

    const select = screen.getByTestId("subcategory-select");
    expect(select).toBeInTheDocument();
    expect(select).toBeDisabled();
    expect(select).toHaveValue("");
    expect(screen.getByRole("option", { name: /wybierz kategorię/i })).toBeInTheDocument();
    expect(mockUseQuery).toHaveBeenCalledWith(expect.anything(), "skip");
  });

  it("renders loading state when categorySlug is set and query returns undefined", () => {
    mockUseQuery.mockReturnValue(undefined);

    render(
      <SubcategorySelect
        categorySlug="gloves"
        currentSlug=""
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByTestId("subcategory-select-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("subcategory-select")).not.toBeInTheDocument();
    expect(mockUseQuery).toHaveBeenCalledWith(expect.anything(), { categorySlug: "gloves" });
  });

  it("renders options from subcategories and calls onSelect when selection changes", () => {
    const subcategories = [
      { slug: "gumowe", displayName: "Gumowe", order: 1 },
      { slug: "bawelniane", displayName: "Bawełniane", order: 2 },
    ];
    mockUseQuery.mockReturnValue(subcategories);
    const onSelect = vi.fn();

    render(
      <SubcategorySelect
        categorySlug="gloves"
        currentSlug=""
        onSelect={onSelect}
      />,
    );

    const select = screen.getByTestId("subcategory-select");
    expect(select).toBeInTheDocument();
    expect(select).not.toBeDisabled();
    expect(select).toHaveValue("");
    expect(screen.getByRole("option", { name: /brak/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Gumowe" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Bawełniane" })).toBeInTheDocument();

    fireEvent.change(select, { target: { value: "gumowe" } });
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("gumowe");
  });

  it("shows currentSlug as selected value", () => {
    mockUseQuery.mockReturnValue([
      { slug: "gumowe", displayName: "Gumowe", order: 1 },
    ]);

    render(
      <SubcategorySelect
        categorySlug="gloves"
        currentSlug="gumowe"
        onSelect={vi.fn()}
      />,
    );

    const select = screen.getByTestId("subcategory-select");
    expect(select).toHaveValue("gumowe");
  });

  it("renders disabled when disabled prop is true", () => {
    mockUseQuery.mockReturnValue([{ slug: "x", displayName: "X", order: 0 }]);

    render(
      <SubcategorySelect
        categorySlug="gloves"
        currentSlug=""
        onSelect={vi.fn()}
        disabled={true}
      />,
    );

    expect(screen.getByTestId("subcategory-select")).toBeDisabled();
  });

  it("passes id to select element when provided", () => {
    mockUseQuery.mockReturnValue([]);

    render(
      <SubcategorySelect
        categorySlug="gloves"
        currentSlug=""
        onSelect={vi.fn()}
        id="my-subcategory-select"
      />,
    );

    const select = screen.getByTestId("subcategory-select");
    expect(select).toHaveAttribute("id", "my-subcategory-select");
  });
});
