import { getStatusColor } from "@/utils/project";
import { ProjectStatus } from "@/types/project";

describe("project utils", () => {
  describe("getStatusColor", () => {
    it.each<[ProjectStatus, string]>([
      ["未着手", "bg-gray-500"],
      ["進行中", "bg-blue-500"],
      ["完了", "bg-green-500"],
    ])("%sステータスに対して%sクラスを返す", (status, expectedColor) => {
      expect(getStatusColor(status)).toBe(expectedColor);
    });
  });
});
