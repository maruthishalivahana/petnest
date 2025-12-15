'use client';

import { LogoutButton } from '@/components/auth/LogoutButton';
import { Card } from '@/components/ui/card';

/**
 * Example page demonstrating different LogoutButton styles and use cases
 * Navigate to /examples/logout-examples to see this page
 */
export default function LogoutExamplesPage() {
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Logout Button Examples</h1>
                    <p className="text-muted-foreground">
                        Different ways to integrate the LogoutButton component
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Example 1: Default Button */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Default Button</h3>
                        <div className="flex gap-4">
                            <LogoutButton
                                variant="destructive"
                                size="default"
                            />
                            <div className="text-sm text-muted-foreground">
                                <p>Standard logout button</p>
                                <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                                    {`<LogoutButton variant="destructive" />`}
                                </code>
                            </div>
                        </div>
                    </Card>

                    {/* Example 2: With Different Variant */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Outline Variant</h3>
                        <div className="space-y-4">
                            <LogoutButton
                                variant="outline"
                                size="default"
                            />
                            <div className="text-sm text-muted-foreground">
                                <p>Clear and explicit logout action</p>
                                <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                                    {`<LogoutButton variant="outline" />`}
                                </code>
                            </div>
                        </div>
                    </Card>

                    {/* Example 3: Ghost Variant */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Ghost Variant (Sidebar)</h3>
                        <div className="space-y-4">
                            <LogoutButton
                                variant="ghost"
                                size="lg"
                                className="w-full justify-start"
                            />
                            <div className="text-sm text-muted-foreground">
                                <p>Subtle style for sidebars</p>
                                <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                                    {`<LogoutButton variant="ghost" size="lg" />`}
                                </code>
                            </div>
                        </div>
                    </Card>

                    {/* Example 4: Outline Variant */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Outline Variant</h3>
                        <div className="space-y-4">
                            <LogoutButton
                                variant="outline"
                                size="default"
                                className="w-full"
                            />
                            <div className="text-sm text-muted-foreground">
                                <p>Less emphasis, cleaner look</p>
                                <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                                    {`<LogoutButton variant="outline" />`}
                                </code>
                            </div>
                        </div>
                    </Card>

                    {/* Example 5: Custom Styling */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Custom Styling</h3>
                        <div className="space-y-4">
                            <LogoutButton
                                variant="destructive"
                                size="default"
                            />
                            <div className="text-sm text-muted-foreground">
                                <p>Direct logout with API call</p>
                                <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                                    {`<LogoutButton />`}
                                </code>
                            </div>
                        </div>
                    </Card>

                    {/* Example 6: Mobile Full Width */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Mobile Full Width</h3>
                        <div className="space-y-4">
                            <LogoutButton
                                variant="destructive"
                                size="default"
                                className="w-full rounded-full h-12"
                            />
                            <div className="text-sm text-muted-foreground">
                                <p>Perfect for mobile menus</p>
                                <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                                    {`<LogoutButton className="w-full rounded-full" />`}
                                </code>
                            </div>
                        </div>
                    </Card>

                    {/* Example 7: Small Size */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Small Size</h3>
                        <div className="space-y-4">
                            <LogoutButton
                                variant="destructive"
                                size="sm"
                            />
                            <div className="text-sm text-muted-foreground">
                                <p>Compact version for tight spaces</p>
                                <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                                    {`<LogoutButton size="sm" />`}
                                </code>
                            </div>
                        </div>
                    </Card>

                    {/* Example 8: Large Size */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Large Size</h3>
                        <div className="space-y-4">
                            <LogoutButton
                                variant="destructive"
                                size="lg"
                            />
                            <div className="text-sm text-muted-foreground">
                                <p>Prominent action button</p>
                                <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                                    {`<LogoutButton size="lg" />`}
                                </code>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Feature Highlights */}
                <Card className="p-6 bg-primary/5">
                    <h3 className="text-lg font-semibold mb-4">✨ Features</h3>
                    <ul className="space-y-2 text-sm">
                        <li>✅ Direct logout with API endpoint</li>
                        <li>✅ Loading states with spinner animation</li>
                        <li>✅ Automatic Redux state cleanup</li>
                        <li>✅ Clears wishlist and auth data</li>
                        <li>✅ Toast notifications for user feedback</li>
                        <li>✅ Redirects to login page after logout</li>
                        <li>✅ Fully responsive design</li>
                        <li>✅ Simple shadcn button implementation</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
}
