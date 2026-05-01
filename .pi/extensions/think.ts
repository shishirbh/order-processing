export default function (pi: any) {
  pi.registerCommand("ping", {
    description: "Test if extensions work",
    handler: async (_args: any, ctx: any) => {
      ctx.ui.notify("pong — extension loaded!", "info");
    },
  });
}
