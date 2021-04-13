import { Upload } from "./../types/Upload";
import { Image } from "./../entities";
import { Resolver, Arg, Mutation, UseMiddleware } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { s3Uploader } from "../utils/s3Uploader";
import { isAuth } from "../utils/middleware/isAuth";

@Resolver(Image)
export class ImageResolver {
    @Mutation(() => String)
    @UseMiddleware(isAuth)
    async uploadImage(@Arg("image", () => GraphQLUpload) { createReadStream, filename }: Upload): Promise<string> {
        const fileStream = createReadStream();
        const saveFileName = `${Date.now()}_${filename}`;

        try {
            const { Location } = await s3Uploader(fileStream, saveFileName);
            return Location;
        } catch (err) {
            return err;
        }
    }
}
