"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Plugin } from "@/lib/types";

export function PluginConfigModal({ plugin, onClose }: { plugin: Plugin | null; onClose: () => void }) {
  if (!plugin) return null;

  return (
    <Modal open={!!plugin} onClose={onClose} title={`Configure ${plugin.name}`}>
      <div className="space-y-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{plugin.description}</p>
        <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Plugin-specific configuration (API keys, templates, thresholds, etc.) will live here once this
          add-on is wired up to a real provider. For now this is a placeholder so the extensibility
          surface is in place.
        </div>
        <div className="flex justify-end border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
