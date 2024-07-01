import { Code } from "@nextui-org/code";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { button as buttonStyles } from "@nextui-org/theme";

import { subtitle, title } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import { FaGithub as GithubIcon } from "react-icons/fa";

export default function IndexPage() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg justify-center text-center">
				<h1 className={title()}>Make&nbsp;</h1>
				<h1 className={title({ color: "violet" })}>beautiful&nbsp;</h1>
				<br />
				<h1 className={title()}>
					websites regardless of your design experience.
				</h1>
				<h4 className={subtitle({ class: "mt-4" })}>
					Beautiful, fast and modern React UI library.
				</h4>
			</div>

			<div className="flex gap-3">
				<Link
					isExternal
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
					})}
					href={siteConfig.links.docs}
				>
					Documentation
				</Link>
				<Link
					isExternal
					className={buttonStyles({ variant: "bordered", radius: "full" })}
					href={siteConfig.links.github}
				>
					<GithubIcon size={24} />
					GitHub
				</Link>
			</div>

			<div className="mt-8">
				<Snippet hideCopyButton hideSymbol variant="bordered">
					<span>
						Get started by editing <Code color="primary">pages/index.tsx</Code>
					</span>
				</Snippet>
			</div>
		</section>
	);
}
