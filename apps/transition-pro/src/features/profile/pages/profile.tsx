import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default function Profile() {
  return (
    <div className="flex w-full flex-col gap-6 p-8">
      <h1>Mon Profil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Mon identité</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ma situation professionelle</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
