import { getUserToken } from "@/app/Helpers/getUserToken";

import ChangePasswordModal from "@/components/changePassword/ChangePassword";
import DeleteAddressBtn from "@/components/deleteAddress/DeleteAddress";
import UpdateProfileModal from "@/components/updateProfileModal/UpdateProfile";
import { AddressInfo } from "@/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Home, Phone, Building2 } from "lucide-react";
import AddAddressComp from "@/components/addAddressComponent/AddAddressComp";

export default async function ProfilePage() {
  const userToken = await getUserToken();

  const addressesResponse = await fetch(
    "https://ecommerce.routemisr.com/api/v1/addresses",
    {
      method: "GET",
      headers: { token: userToken as any },
      cache: "no-store",
    }
  );

  const addressesPayload = await addressesResponse.json();
  const savedAddresses: AddressInfo[] = addressesPayload?.data || [];

  return (
    <div className="container mx-auto px-4 py-10 sm:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Your Profile
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Manage your account settings and saved addresses for faster checkout.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <UpdateProfileModal token={userToken} />
          <ChangePasswordModal token={userToken} />
        </div>
      </div>

      <div className="mt-10">
        {savedAddresses.length === 0 ? (
          <div className="rounded-3xl border bg-card p-8 sm:p-10 shadow-sm">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-muted/60 ring-1 ring-border flex items-center justify-center">
                <MapPin className="h-6 w-6 text-muted-foreground" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold">
                No saved addresses yet
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground max-w-md">
                Add your first address to speed up checkout and deliveries.
              </p>

              <div className="mt-3">
                <AddAddressComp token={userToken} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold">Saved Addresses</h2>
              <span className="text-sm text-muted-foreground">
                {savedAddresses.length} total
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {savedAddresses.map((addressItem) => (
                <Card
                  key={addressItem._id}
                  className="rounded-3xl border bg-card shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle className="text-lg sm:text-xl font-bold capitalize">
                          {addressItem.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Saved Address
                        </p>
                      </div>

                      <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200">
                        Default
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Home className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <p className="text-xs text-muted-foreground">
                            Details
                          </p>
                          <p className="text-sm font-medium leading-relaxed">
                            {addressItem.details}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm font-medium">
                            {addressItem.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <p className="text-xs text-muted-foreground">City</p>
                          <p className="text-sm font-medium">
                            {addressItem.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <DeleteAddressBtn id={addressItem._id} token={userToken} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
