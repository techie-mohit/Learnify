import React from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    try {
      const res = await createCheckoutSession(courseId).unwrap(); // unwrap is important
      if (res?.url) {
        window.location.href = res.url; // redirect to Stripe checkout
      } else {
        toast.error("Invalid response from server");
      }
    } catch (err) {
      // RTK Query errors can be in err.data.message or err.error
      const msg = err?.data?.message || err?.error || "Failed to create checkout session";
      toast.error(msg);
    }
  };

  return (
    <Button
      disabled={isLoading}
      onClick={purchaseCourseHandler}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
