import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Users, 
  MessageSquare, 
  Send, 
  UserCheck,
  UserX,
  Mail,
  Phone
} from "lucide-react";

export default function VirtualHearing() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [selectedParty, setSelectedParty] = useState<"forward" | "respondent" | null>(null);
  const [message, setMessage] = useState("");
  const [contactForm, setContactForm] = useState({
    lawyerContact: "",
    clientContact: "",
  });

  const handleSendNotification = () => {
    if (!selectedParty || !contactForm.lawyerContact || !contactForm.clientContact) {
      alert("Please select a party and fill in all contact details");
      return;
    }
    
    console.log("Sending notification to:", selectedParty, contactForm);
    alert(`Notification sent to ${selectedParty} party successfully!`);
    
    // Reset form
    setSelectedParty(null);
    setMessage("");
    setContactForm({ lawyerContact: "", clientContact: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
      <header className="bg-gradient-legal text-primary-foreground shadow-legal">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Video className="h-6 w-6" />
              <div>
                <h1 className="text-xl font-bold">Virtual Hearing</h1>
                <p className="text-primary-foreground/80 text-sm">State v. John Doe - MHCT010012342023</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              Live
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Conference Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card bg-gradient-card">
              <CardContent className="p-6">
                <div className="aspect-video bg-secondary/30 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Video className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Video Conference Area</p>
                    <p className="text-sm text-muted-foreground">Participants will appear here</p>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button
                    variant={isMuted ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isVideoOff ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Party Selection */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Party Communication</span>
                </CardTitle>
                <CardDescription>Select a party to send communication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={selectedParty === "forward" ? "default" : "outline"}
                    onClick={() => setSelectedParty("forward")}
                    className="h-20 flex-col"
                  >
                    <UserCheck className="h-6 w-6 mb-2" />
                    <span>Forward Party</span>
                    <span className="text-xs opacity-70">Petitioner</span>
                  </Button>
                  <Button
                    variant={selectedParty === "respondent" ? "default" : "outline"}
                    onClick={() => setSelectedParty("respondent")}
                    className="h-20 flex-col"
                  >
                    <UserX className="h-6 w-6 mb-2" />
                    <span>Respondent Party</span>
                    <span className="text-xs opacity-70">Defendant</span>
                  </Button>
                </div>

                {selectedParty && (
                  <div className="space-y-4 p-4 border rounded-lg bg-secondary/20">
                    <div className="space-y-2">
                      <Label htmlFor="message">Message/Voice Note</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message or voice note content..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lawyerContact">Lawyer Contact</Label>
                        <Input
                          id="lawyerContact"
                          value={contactForm.lawyerContact}
                          onChange={(e) => setContactForm({ ...contactForm, lawyerContact: e.target.value })}
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientContact">Client Contact</Label>
                        <Input
                          id="clientContact"
                          value={contactForm.clientContact}
                          onChange={(e) => setContactForm({ ...contactForm, clientContact: e.target.value })}
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleSendNotification} className="flex-1 bg-accent hover:bg-accent/90">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Send SMS
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Panel */}
          <div className="space-y-6">
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Chat</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 border rounded-lg p-3 mb-3 overflow-y-auto bg-secondary/20">
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-card rounded text-right">
                      <p className="font-medium">You</p>
                      <p>Good morning, Your Honor.</p>
                    </div>
                    <div className="p-2 bg-primary/10 rounded">
                      <p className="font-medium">Judge</p>
                      <p>Good morning. Please proceed with your arguments.</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button size="sm" className="bg-gradient-legal">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle>Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-2 rounded border">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Hon. Justice Smith</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded border">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Adv. John Kumar</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded border">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Adv. Sarah Patel</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}